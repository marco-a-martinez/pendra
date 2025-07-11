# Drag Issue Test Plan

## Current Status

### Changes Made:
1. ✅ Removed CSS hover margin/padding that was causing layout shifts
2. ✅ Simplified component structure to match working todo pattern
3. ✅ All changes committed and pushed to GitHub

### Deployment Status:
- GitHub: All commits are present
- Local Dev Server: Running with latest changes
- Vercel: Unknown deployment status

## Test Steps:

1. **Create a todo with checklist items**
   - Add at least 3 checklist items
   - Ensure they display correctly

2. **Test hover behavior**
   - Hover over checklist items
   - Check if drag handles appear
   - Verify no layout shift on hover

3. **Test drag behavior**
   - Try to drag a checklist item
   - Note exactly what happens:
     - Does it jump immediately?
     - In which direction?
     - How far does it move?

## Remaining Suspects:

1. **Container Margin Issue**
   - The checklist container has `marginLeft: 56px`
   - This is the main difference from working todos
   - Could affect transform origin calculations

2. **Transform Origin**
   - Default transform-origin might be affected by margins
   - May need explicit transform-origin setting

3. **CSS Specificity**
   - Other CSS rules might be overriding our fixes
   - Need to check computed styles in browser

## Next Steps:

If the issue persists after our CSS fix:
1. Remove the container margin temporarily
2. Test if that fixes the issue
3. If yes, restructure the indentation approach
4. If no, investigate transform-origin and other CSS properties