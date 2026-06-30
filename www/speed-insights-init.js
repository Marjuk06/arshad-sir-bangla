// Speed Insights initialization
import { injectSpeedInsights } from './speed-insights.mjs';

// Initialize Speed Insights when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSpeedInsights({
      debug: false
    });
  });
} else {
  // DOM is already ready
  injectSpeedInsights({
    debug: false
  });
}
