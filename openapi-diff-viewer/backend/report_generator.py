import uuid
import json
from deepdiff import DeepDiff
from .comparator import compare_specs

HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace']

def generate_report(old_path, new_path):
    old_paths, new_paths, old_spec, new_spec = compare_specs(old_path, new_path)
    
    changes = []
    stats = {
        "added_count": 0,
        "deleted_count": 0,
        "updated_count": 0,
        "breaking_count": 0
    }
    
    all_paths = set(old_paths.keys()) | set(new_paths.keys())
    
    for path in all_paths:
        old_path_item = old_paths.get(path, {})
        new_path_item = new_paths.get(path, {})
        
        # Identify methods
        old_methods = {k: v for k, v in old_path_item.items() if k.lower() in HTTP_METHODS}
        new_methods = {k: v for k, v in new_path_item.items() if k.lower() in HTTP_METHODS}
        
        all_methods = set(old_methods.keys()) | set(new_methods.keys())
        
        for method in all_methods:
            method_lower = method.lower()
            old_op = old_methods.get(method)
            new_op = new_methods.get(method)
            
            change_entry = {
                "id": str(uuid.uuid4()),
                "path": path,
                "method": method.upper(),
                "status": "",
                "is_breaking": False,
                "summary_text": "",
                "details": []
            }
            
            if old_op and not new_op:
                change_entry["status"] = "deleted"
                change_entry["summary_text"] = "Endpoint deleted"
                change_entry["is_breaking"] = True
                stats["deleted_count"] += 1
                stats["breaking_count"] += 1
                changes.append(change_entry)
                
            elif not old_op and new_op:
                change_entry["status"] = "added"
                change_entry["summary_text"] = "Endpoint added"
                stats["added_count"] += 1
                changes.append(change_entry)
                
            else:
                # Updated - use comprehensive diff analysis
                diff = DeepDiff(
                    old_op, 
                    new_op, 
                    ignore_order=False,  # Don't ignore order to catch array changes
                    view='tree',
                    verbose_level=2,  # More detailed output
                    exclude_paths=[],  # Don't exclude anything
                    significant_digits=10,  # For number comparisons
                    number_format_notation="f"
                )
                
                if not diff:
                    continue
                
                change_entry["status"] = "updated"
                stats["updated_count"] += 1
                
                details = []
                is_breaking = False
                summary_parts = []
                
                # Helper to process diff items
                def process_diff_item(node, change_type, breaking_check=False):
                    loc = node.path(output_format='list')
                    loc_str = ".".join([str(x) for x in loc])
                    
                    val_old = getattr(node, 't1', 'N/A')
                    val_new = getattr(node, 't2', 'N/A')
                    
                    # Heuristic for breaking
                    is_break = False
                    if breaking_check:
                        # If required added
                        if 'required' in loc and 'responses' not in loc:
                            is_break = True
                        # If type changed
                        if change_type == 'type_mismatch':
                             is_break = True
                    
                    return {
                        "location": loc_str,
                        "old_value": str(val_old),
                        "new_value": str(val_new),
                        "change_type": change_type
                    }, is_break, loc_str

                # Type changes
                if 'type_changes' in diff:
                    for node in diff['type_changes']:
                        det, brk, loc_str = process_diff_item(node, 'type_mismatch', breaking_check=True)
                        details.append(det)
                        if brk: is_breaking = True
                        summary_parts.append(f"Type mismatch at {loc_str}")

                # Values changed
                if 'values_changed' in diff:
                    for node in diff['values_changed']:
                        det, brk, loc_str = process_diff_item(node, 'value_changed')
                        details.append(det)
                        summary_parts.append(f"Value changed at {loc_str}")

                # Item added
                if 'dictionary_item_added' in diff:
                    for node in diff['dictionary_item_added']:
                        det, brk, loc_str = process_diff_item(node, 'item_added', breaking_check=True)
                        if brk:
                            det['change_type'] = 'required_added'
                            is_breaking = True
                            summary_parts.append(f"Required field added at {loc_str}")
                        else:
                            summary_parts.append(f"Item added at {loc_str}")
                        details.append(det)

                if 'iterable_item_added' in diff:
                    for node in diff['iterable_item_added']:
                        det, brk, loc_str = process_diff_item(node, 'item_added', breaking_check=True)
                        # Check if we are in a required list
                        if 'required' in loc_str and 'responses' not in loc_str:
                             det['change_type'] = 'required_added'
                             is_breaking = True
                             summary_parts.append(f"Required field added at {loc_str}")
                        else:
                             summary_parts.append(f"Item added at {loc_str}")
                        details.append(det)

                # Item removed
                if 'dictionary_item_removed' in diff:
                    for node in diff['dictionary_item_removed']:
                        det, brk, loc_str = process_diff_item(node, 'item_removed')
                        details.append(det)
                        summary_parts.append(f"Item removed at {loc_str}")
                
                if 'iterable_item_removed' in diff:
                    for node in diff['iterable_item_removed']:
                        det, brk, loc_str = process_diff_item(node, 'item_removed')
                        details.append(det)
                        summary_parts.append(f"Item removed at {loc_str}")

                change_entry["details"] = details
                change_entry["is_breaking"] = is_breaking
                change_entry["summary_text"] = "; ".join(summary_parts) if summary_parts else "Minor updates"
                
                if is_breaking:
                    stats["breaking_count"] += 1
                
                changes.append(change_entry)

    return {
        "summary": stats,
        "changes": changes,
        "api_spec": new_spec  # Include new spec for API documentation
    }
