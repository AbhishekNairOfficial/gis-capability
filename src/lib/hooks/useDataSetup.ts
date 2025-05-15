import React from "react";
import { fetchTaxData } from "@/app/actions/taxData";
import kingCountyVoting from '../../data/Voting_Districts_of_King_County___votdst_area.json';

export interface TaxData {
    state_name: string;
    total: number;
}

interface VotingFeature {
    type: string;
    properties: {
      SUM_VOTERS: number;
      [key: string]: any;
    };
    geometry: any;
}

interface VotingGeoJSON {
    type: string;
    features: VotingFeature[];
  }

// Color scale function
function createColorScale(min: number, max: number) {
    return (value: number): [number, number, number, number] => {
      // Use logarithmic scale for better distribution
      const logMin = Math.log10(min);
      const logMax = Math.log10(max);
      const logValue = Math.log10(value);
      const normalized = (logValue - logMin) / (logMax - logMin);
      
      // Create a gradient from very light blue to deep blue
      // Start: Very Light Blue (230, 240, 255)
      // End: Deep Blue (0, 0, 139)
      const r = Math.floor(230 * (1 - normalized));
      const g = Math.floor(240 * (1 - normalized));
      const b = Math.floor(139 + (255 - 139) * (1 - normalized));
      
      return [r, g, b, 255]; // Full opacity
    };
}

// Radius scale function
function createRadiusScale(min: number, max: number) {
    return (value: number): number => {
      // Use power scale for better contrast
      const power = 0.5; // Square root scale
      const normalized = Math.pow((value - min) / (max - min), power);
      
      // Scale radius between 1 and 49 pixels
      return 1 + normalized * 49;
    };
}


const useDataSetup = () => {
    const [taxData, setTaxData] = React.useState<TaxData[]>([]);
    const [colorScale, setColorScale] = React.useState<((value: number) => [number, number, number, number]) | null>(null);
    const [radiusScale, setRadiusScale] = React.useState<((value: number) => number) | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadData() {
          try {
            // Load tax data
            const data = await fetchTaxData();
            setTaxData(data);
            
            // Calculate min and max values for the color scale
            const totals = data.map(item => item.total);
            const min = Math.min(...totals);
            const max = Math.max(...totals);
            
            // Create color scale function
            setColorScale(() => createColorScale(min, max));
    
            // Calculate radius scale for voting data
            const votingData = kingCountyVoting as VotingGeoJSON;
            if (votingData?.features) {
              const voters = votingData.features.map(feature => feature.properties.SUM_VOTERS);
              const minVoters = Math.min(...voters);
              const maxVoters = Math.max(...voters);
              setRadiusScale(() => createRadiusScale(minVoters, maxVoters));
            }
          } catch (error) {
            console.error('Error loading data:', error);
          } finally {
            setIsLoading(false);
          }
        }
        
        loadData();
      }, []);

      return {taxData, colorScale,radiusScale, isLoading};
}

export default useDataSetup;