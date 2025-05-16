import useZipcodeStore from "@/lib/zustand/useZipcodeStore";
import { useEffect, useState } from "react";

const HoverCard = () => {
    const {x,y} = useZipcodeStore((state: any) => state.coordinates);
    const zipCode = useZipcodeStore((state: any) => state.zipcode);
    const [displayValue, setDisplayValue] = useState(zipCode || "—");

    useEffect(() => {
        if (zipCode) {
            const targetValue = parseInt(zipCode);
            const startValue = parseInt(displayValue) || 0;
            const duration = 500; // Animation duration in ms
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeProgress = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                const currentValue = startValue + (targetValue - startValue) * easeProgress;
                setDisplayValue(Math.round(currentValue).toString());

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        } else {
            setDisplayValue("—");
        }
    }, [zipCode]);

    return (
        <div
          style={{
            left: `${x}px`,
            top: `${y}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full -mt-2 bg-white/98 p-3 pl-6 rounded-lg shadow-lg pointer-events-none z-[1000] border border-black/10 backdrop-blur-sm min-w-[140px] text-left flex flex-col gap-1"
        >
          <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-blue-600 rounded-sm" />
          <div className="text-lg text-slate-500 uppercase tracking-wider font-medium">
            {displayValue}
          </div>
        </div>
    )
}

export default HoverCard;