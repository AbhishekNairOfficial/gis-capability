import { formatNumber } from "@/lib/utils";

const HoverCard = ({ hoverInfo, displayValue }: { hoverInfo: any, displayValue: number }) => {
    if (!hoverInfo || !displayValue) return null;

    const { x, y, object } = hoverInfo;
    const {votdst, NAME} = object.points[0].properties;

    return (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            padding: '12px 16px 12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            zIndex: 1000,
            transform: 'translate(-50%, -100%)',
            marginTop: '-8px',
            border: '1px solid rgba(0,0,0,0.1)',
            backdropFilter: 'blur(4px)',
            minWidth: '140px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <div style={{
            position: 'absolute',
            left: '8px',
            top: '12px',
            bottom: '12px',
            width: '2px',
            backgroundColor: '#2563eb',
            borderRadius: '1px'
          }} />
          <div style={{ 
            fontSize: '13px', 
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: '500'
          }}>
            {NAME}
          </div>
          <div style={{ 
            fontSize: '22px', 
            fontWeight: '600',
            color: '#1e293b',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.2'
          }}>
            {formatNumber(Math.round(displayValue))}
          </div>
        </div>
    )
}

export default HoverCard;