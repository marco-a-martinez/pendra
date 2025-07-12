# Branching Strategy

## Branches

### `main`
- **Purpose**: Production-ready code
- **Deploy**: Auto-deploys to pendra.vercel.app
- **Protection**: Should only receive tested, stable code

### `development`
- **Purpose**: Testing new features and experiments
- **Deploy**: Can set up preview deployments on Vercel
- **Usage**: All new feature development happens here

## Workflow

1. **Feature Development**
   ```bash
   git checkout development
   # Make your changes
   git add .
   git commit -m "feat: your feature description"
   git push origin development
   ```

2. **Testing in Development**
   - Test thoroughly in the development branch
   - Vercel will create preview deployments for each push

3. **Merging to Main**
   ```bash
   git checkout main
   git merge development
   git push origin main
   ```

4. **Reverting to Stable**
   If something goes wrong, you can always revert to the stable version:
   ```bash
   git checkout v1.0.0-stable
   # Or reset main to stable
   git checkout main
   git reset --hard v1.0.0-stable
   git push --force origin main
   ```

## Tags

- `v1.0.0-stable`: Clean build with basic todo functionality (no checklists)

## Vercel Configuration

To set up preview deployments for the development branch:

1. Go to your Vercel project settings
2. Navigate to Git → Ignored Build Step
3. Add a rule to build all branches
4. Preview URLs will be generated for each push to development

## Best Practices

1. Always test in `development` first
2. Create tags for stable releases before major changes
3. Use descriptive commit messages
4. Keep `main` branch stable and deployable
5. Document breaking changes