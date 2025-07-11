# Root Cause Analysis

## The Problem
Checklist items shoot off to the bottom-right when dragged.

## Root Cause
The checklist items are inside a container with `margin-left: 56px`. This creates a positioning context issue when transforms are applied during drag operations.

### Structure Comparison:

**Working Todo Items:**
```
<DndContext>
  <SortableContext>
    <SortableTodoItem /> <!-- No margin container -->
    <SortableTodoItem />
  </SortableContext>
</DndContext>
```

**Broken Checklist Items:**
```
<div style={{ marginLeft: '56px' }}> <!-- PROBLEM: Margin here! -->
  <DndContext>
    <SortableContext>
      <SortableChecklistItem />
      <SortableChecklistItem />
    </SortableContext>
  </DndContext>
</div>
```

## Solution Options:

1. **Remove the margin from the container** and apply it to individual items
2. **Use padding instead of margin** on the container
3. **Apply the margin inside the checklist items** rather than on the container
4. **Use CSS transform** for the offset instead of margin

The best solution is likely option 1 or 2, as they maintain the visual layout while fixing the transform calculation issue.
