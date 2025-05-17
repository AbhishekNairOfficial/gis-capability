import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card"
import React from "react";
import ReactMarkdown from 'react-markdown';

const InsightsCard = ({ data }: { data: any[] }) => {
    const [insights, setInsights] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const fetchInsights = async () => {
            if (!isMounted) return;
            
            try {
                const response = await fetch('/api/generateZipCodeInsights', {
                    method: 'POST',
                    body: JSON.stringify({ taxData: data }),
                    signal: abortController.signal
                });
                const responseData = await response.json();
                if (isMounted) {
                    setInsights(responseData.insights);
                    setLoading(false);
                }
            } catch (error: unknown) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                console.error('Error fetching insights:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchInsights();

        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [data]);

    return (
        <Card className="max-h-[400px] flex flex-col">
            <CardHeader className="border-b flex-none">
                <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
                {loading ? (
                    <p className="text-muted-foreground">Analyzing data...</p>
                ) : insights ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none overflow-y-auto">
                        <ReactMarkdown>{insights}</ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-muted-foreground">No insights available</p>
                )}
            </CardContent>
        </Card>
    )
}

export default InsightsCard;