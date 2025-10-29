import React, { useEffect, useRef } from 'react';

const EconomicCalendarWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent re-injecting script in React's strict mode
    if (container.hasChildNodes()) {
      return;
    }

    const mainScript = document.createElement('script');
    mainScript.src = 'https://fxverify.com/Content/remote/remote-calendar-widget.js';
    mainScript.type = 'text/javascript';
    mainScript.async = true;

    mainScript.onload = () => {
      // This inline script runs after the main library has loaded
      const initScript = document.createElement('script');
      initScript.type = 'text/javascript';
      initScript.innerHTML = `
        try {
          RemoteCalendar({
            "DefaultTime": "this_week",
            "DefaultTheme": "plain",
            "Url": "https://fxverify.com",
            "SubPath": "economic-calendar",
            "IsShowEmbedButton": false,
            "DefaultCountries": "jp,us,gb,ca",
            "DefaultImpacts": "HIGH,MEDIUM,NONE",
            "ContainerId": "economic-calendar-423242"
          });
        } catch (e) {
          console.error('Failed to initialize fxverify calendar widget:', e);
          if (container) {
            container.innerHTML = '<p class="text-center text-gray-500">Could not load calendar widget.</p>';
          }
        }
      `;
      container.appendChild(initScript);
    };

    mainScript.onerror = () => {
      // Handle cases where the script fails to load (e.g., network error, adblocker)
      console.error('Failed to load fxverify calendar script.');
      if (container) {
        container.innerHTML = '<p class="text-center text-gray-500">Could not load calendar widget.</p>';
      }
    };
    
    container.appendChild(mainScript);

    // Cleanup function to clear the container when the component unmounts
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <section className="mt-6 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold text-gray-600 mb-4">Economic Calendar</h2>
      <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
        <div className="h-80 overflow-y-auto custom-scrollbar pr-2">
          <div id="economic-calendar-423242" ref={containerRef}></div>
        </div>
      </div>
    </section>
  );
};

export default EconomicCalendarWidget;