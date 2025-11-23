# Page Navigation Animation System

This document outlines the implementation of the page transition system used in the Epic Switcher. The system provides entry and exit animations when navigating between routes.

## 1. Technology Stack

- **Library**: [Framer Motion](https://www.framer.com/motion/)
- **Key Components**: `AnimatePresence`, `motion.div`
- **Framework**: React (Vite)

## 2. Architecture Overview

The animation system solves the standard React Router limitation where components unmount instantly upon navigation. We use `AnimatePresence` to keep the "old" page in the DOM while it animates out, and simultaneously animate the "new" page in.

### Core Components

#### A. `AnimatedRoutes.jsx`
**Location**: `frontend/src/components/AnimatedRoutes.jsx`

This component acts as the router orchestrator. It replaces the standard `<Routes>` component in `App.jsx`.

- **Key Responsibility**: It wraps the routes in `<AnimatePresence mode="wait">`.
- **Mechanism**: It passes the `location` object and a unique `key` (the pathname) to `<Routes>`. This forces React to treat the route container as a distinct tree whenever the URL changes, triggering the exit/enter lifecycle hooks that Framer Motion watches.
- **Mode**: `mode="wait"` ensures the exiting page finishes its animation *before* the new page starts entering. This prevents layout shifts and content overlap.

#### B. `PageTransition.jsx`
**Location**: `frontend/src/components/PageTransition.jsx`

This is a reusable wrapper component that defines the actual visual animation.

- **Key Responsibility**: Wraps the content of every route.
- **Mechanism**: Uses `<motion.div>` with defined `variants` for `initial`, `animate` (in), and `exit` (out) states.

## 3. Implementation Guide

### Adding a New Animated Page

When adding a new route to the application, we register it in `AnimatedRoutes.jsx` instead of `App.jsx`.

1.  **Import the page component**:
    ```javascript
    import NewPage from '../pages/NewPage';
    ```

2.  **Add the Route**:
    Inside the `<Routes>` block, we add the new route and wrap the element in `<PageTransition>`.

    ```javascript
    <Route
      path="/new-page"
      element={
        <PageTransition>
          <NewPage />
        </PageTransition>
      }
    />
    ```

### Customizing Animations

All animation configuration is centralized in `frontend/src/components/PageTransition.jsx`.

#### Changing Speed and Easing
Modify the `pageTransition` object:

```javascript
const pageTransition = {
  type: 'tween',
  ease: 'easeOut', // Options: 'linear', 'easeInOut', 'circOut', 'backOut'
  duration: 0.3    // Duration in seconds
};
```

#### Changing the Visual Effect
Modify the `pageVariants` object.

**Current Effect (Slide Up & Fade):**
```javascript
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,       // Starts slightly below
    scale: 0.99  // Starts slightly smaller
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -10,      // Exits slightly above
    scale: 0.99
  }
};
```

## 4. Best Practices

- **Use `AnimatedRoutes`**: We avoid using standard `<Routes>` in `App.jsx` to maintain animations.
- **Scroll Management**: The `MainLayout` component handles resetting the scroll position to the top (`scrollTop = 0`) on every route change. This ensures that navigating to a new page doesn't leave the user scrolled down.
- **Performance**: The animations use `transform` and `opacity` properties, which are GPU-accelerated and performant. We avoid animating properties like `width`, `height`, or `margin` as they trigger layout recalculations.
