```markdown
1. INVESTIGATE CURRENT IMPLEMENTATION
   - Use developer__grep to locate all grid-related files
   - Examine Map.js and Grid.js implementations
   - Document current grid creation and management code
   [PAUSE FOR USER VERIFICATION]

2. CREATE TEST BRANCH
   - Instruct user to create branch: 'fix/grid-integration'
   - Document starting point with current behavior
   [PAUSE FOR USER TO CREATE BRANCH]

3. SET UP TEST ENVIRONMENT
   - Modify grid-demo.html to add debugging helpers
   - Add console logging for canvas operations
   [PAUSE FOR USER TO COMMIT CHANGES]
```

## Phase 2: Core Implementation
```markdown
1. CREATE FABRIC GRID CLASS
   - Define new FabricGrid class extending fabric.Object
   - Implement basic rendering methods
   - Add initial pan/zoom handling
   [PAUSE FOR USER TO REVIEW & COMMIT]

2. MODIFY MAP CLASS
   - Remove separate grid canvas creation
   - Integrate new FabricGrid into main canvas
   - Update grid management methods
   [PAUSE FOR USER TO REVIEW & COMMIT]

3. IMPLEMENT GRID RENDERING
   - Add efficient line rendering logic
   - Handle viewport calculations
   - Implement clipping and bounds
   [PAUSE FOR USER TO REVIEW & COMMIT]
```

## Phase 3: Event & Transform Handling
```markdown
1. UPDATE EVENT SYSTEM
   - Modify event handlers to use single canvas
   - Update pointer event handling
   - Ensure proper event bubbling
   [PAUSE FOR USER TO REVIEW & COMMIT]

2. IMPLEMENT TRANSFORM HANDLING
   - Add viewport transform calculations
   - Handle zoom operations
   - Manage pan operations
   [PAUSE FOR USER TO REVIEW & COMMIT]
```

## Phase 4: Testing & Optimization
```markdown
1. ADD TEST COVERAGE
   - Create unit tests for new FabricGrid class
   - Add integration tests for Map with grid
   - Test pan/zoom operations
   [PAUSE FOR USER TO REVIEW & COMMIT]

2. PERFORMANCE OPTIMIZATION
   - Add render caching
   - Optimize line calculations
   - Add viewport culling
   [PAUSE FOR USER TO REVIEW & COMMIT]
```

## Phase 5: Migration & Documentation
```markdown
1. CREATE MIGRATION GUIDE
   - Document API changes
   - Provide upgrade instructions
   - Add migration examples
   [PAUSE FOR USER TO REVIEW]

2. UPDATE DOCUMENTATION
   - Update architecture docs
   - Add new grid implementation details
   - Update example code
   [PAUSE FOR USER TO REVIEW & COMMIT]
```

## Command Format for Implementation Steps
Each implementation step should use this format:
```markdown
CURRENT TASK: [Task Name]
FILES TO MODIFY:
- [file path 1]
- [file path 2]

IMPLEMENTATION STEPS:
1. [specific step]
2. [specific step]
3. [specific step]

VERIFICATION:
1. [what to check]
2. [what to check]

[PAUSE FOR USER VERIFICATION]
```

## Tools to Use
- developer__grep: For code search
- developer__text_editor: For file modifications
- developer__glob: For file discovery
- sub_recipe__execute_task: For any subtasks