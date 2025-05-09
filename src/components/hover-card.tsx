import { formatNumber } from "@/lib/utils";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const HoverCard = ({ hoverInfo, displayValue }: { hoverInfo: any, displayValue: number }) => {

    const { x, y, object } = hoverInfo;
    const {votdst, NAME} = object.points[0].properties;
    const [insights, setInsights] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const abortControllerRef = React.useRef<AbortController | null>(null);

    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        // Cancel any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        const response = await fetch('/api/generateInsights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ districtId: votdst, voterCount: displayValue }),
          signal: abortControllerRef.current.signal
        });
  
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error);
        }
  
        const data = await response.json();
        setInsights(data.insights);
      } catch (err: any) {
        // Don't set error state if the request was aborted
        if (err.name !== 'AbortError') {
          console.error('Error fetching insights:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    React.useEffect(() => {
      if (displayValue) {
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
          fetchInsights();
        }, 1 * 1000);

        // Cleanup function to clear the timeout and abort any pending request
        return () => {
          clearTimeout(timeoutId);
          setIsLoading(false);
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
          }
        };
      }
    }, [displayValue]);

    if (!hoverInfo || !displayValue) return null;

    return (
        <div
          style={{
            left: x,
            top: y,
          }}
          className="absolute -translate-x-1/2 -translate-y-full -mt-2 bg-white/98 p-3 pl-6 rounded-lg shadow-lg pointer-events-none z-[1000] border border-black/10 backdrop-blur-sm min-w-[140px] text-left flex flex-col gap-1"
        >
          <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-blue-600 rounded-sm" />
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            {NAME}
          </div>
          <div className="text-[22px] font-semibold text-slate-800 font-sans leading-tight">
            {formatNumber(Math.round(displayValue))}
          </div>  
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-3 w-[300px]" />
              <Skeleton className="h-3 w-[300px]" />
              <Skeleton className="h-3 w-[250px]" />
            </div>
          ) : insights && (
            <div className="text-xs text-slate-500">
              {insights}
            </div>
          )}
        </div>
    )
}

export default HoverCard;