"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <div
      data-chart={chartId}
      ref={ref}
      className={cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line-line]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none", className)}
      {...props}
    >
      <ChartStyle id={chartId} config={config} />
      <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
    </div>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }) => {
  const colorConfig = React.useMemo(() => {
    return Object.entries(config || {}).map(([key, value]) => ({
      color: typeof value === "string" ? value : value.color,
      variable: `--color-${key}`,
    }));
  }, [config]);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart="${id}"] { ${colorConfig.map((c) => `${c.variable}: ${c.color}`).join("; ")} }`,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef(
  ({ active, payload, className, indicator = "dot", label, labelFormatter, labelClassName, formatter, ...props }, ref) => {
    const tooltipLabel = React.useMemo(() => {
      if (labelFormatter && typeof label === "string") {
        return labelFormatter(label);
      }
      return label;
    }, [label, labelFormatter]);

    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-[#e8e2db] bg-white px-2.5 py-1.5 text-xs shadow-md", className)}
        {...props}
      >
        {tooltipLabel && (
          <div className={cn("font-medium text-[#171717]", labelClassName)}>{tooltipLabel}</div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${item.dataKey}-${index}`;
            const indicatorColor = item.payload?.fill || item.color;

            return (
              <div key={key} className="flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-[#6b6b6f]">
                {indicator === "dot" && indicatorColor && (
                  <div className="shrink-0 rounded-[2px] border" style={{ backgroundColor: indicatorColor, borderColor: indicatorColor }} />
                )}
                {indicator === "line" && indicatorColor && (
                  <div className="shrink-0 border-l-2" style={{ borderColor: indicatorColor }} />
                )}
                <div className="flex flex-1 justify-between leading-none">
                  <div className="grid gap-1.5">
                    <span className="text-[#6b6b6f]">{item.name}</span>
                    {formatter && item?.value !== undefined && item.value !== null ? (
                      <span className="font-mono font-medium tabular-nums text-[#171717]">{formatter(item.value, item)}</span>
                    ) : (
                      <span className="font-mono font-medium tabular-nums text-[#171717]">{item.value}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", ...props }, ref) => {
    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-4", verticalAlign === "top" && "order-first", className)}
        {...props}
      >
        {payload.map((item) => {
          const key = `${item.dataKey}-${item.value}`;
          return (
            <div key={key} className="flex items-center gap-1.5">
              {!hideIcon && (
                <div className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
              )}
              <span className="text-[#6b6b6f]">{item.value}</span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };

