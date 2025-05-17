"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Label } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  returns: {
    label: "No of Returns",
  },
  '$1 under $25,000': {
    label: "$1 under $25,000",
    color: "hsl(var(--chart-1))",
  },
  '$25,000 under $50,000': {
    label: "$25,000 under $50,000",
    color: "hsl(var(--chart-2))",
  },
  '$50,000 under $75,000': {
    label: "$50,000 under $75,000",
    color: "hsl(var(--chart-3))",
  },
  '$75,000 under $100,000': {
    label: "$75,000 under $100,000",
    color: "hsl(var(--chart-4))",
  },
  '$100,000 under $200,000': {
    label: "$100,000 under $200,000",
    color: "hsl(var(--chart-5))",
  },
  '$200,000 or more': {
    label: "$200,000 or more",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig

export default function InteractiveBarChart({ data }: { data: any[] }) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("$1 under $25,000");

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-3">
          <CardTitle>Income Bracket</CardTitle>
          {/* <CardDescription>
            Showing total returns for the last 3 years
          </CardDescription> */}
        </div>
        <div className="flex">
          {['$1 under $25,000', '$25,000 under $50,000', '$50,000 under $75,000', '$75,000 under $100,000', '$100,000 under $200,000', '$200,000 or more'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-1 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-2"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                {/* <span className="text-lg font-bold leading-none sm:text-3xl">
                  {data.reduce((acc, curr) => acc + curr[key], 0).toLocaleString()}
                </span> */}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="returns"
                />
              }
            />
            <Bar 
              dataKey={activeChart} 
              fill={`var(--chart-1)`}
            >
              <Label
                position="top"
                content={({ value }) => value?.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
