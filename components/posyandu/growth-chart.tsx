"use client";

import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { growthPoints, weightBands } from "@/lib/zscore";
import type { ParticipantRecord, VisitRecord } from "@/types/posyandu";

export function GrowthChart({
  participant,
  visits,
}: {
  participant: ParticipantRecord;
  visits: VisitRecord[];
}) {
  const bands = weightBands(participant.gender);
  const actual = growthPoints(visits, participant.dob).filter(
    (p) => typeof p.weightKg === "number",
  );

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={bands} margin={{ top: 8, right: 12, bottom: 4, left: -12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
          <XAxis
            dataKey="age"
            type="number"
            domain={[0, 60]}
            tickCount={13}
            tick={{ fontSize: 11, fill: "#9f1239" }}
            label={{ value: "Umur (bulan)", position: "insideBottom", offset: -2, fontSize: 11, fill: "#9f1239" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9f1239" }}
            label={{ value: "BB (kg)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#9f1239" }}
            domain={[0, "dataMax + 2"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #fecdd3",
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [
              `${value} kg`,
              {
                sd3neg: "-3 SD",
                sd2neg: "-2 SD",
                median: "Median WHO",
                sd2pos: "+2 SD",
                sd3pos: "+3 SD",
                actual: participant.fullName,
              }[name] ?? name,
            ]}
            labelFormatter={(age) => `Umur ${age} bulan`}
          />
          <Legend
            formatter={(value: string) =>
              ({
                sd3neg: "-3 SD",
                sd2neg: "-2 SD",
                median: "Median WHO",
                sd2pos: "+2 SD",
                sd3pos: "+3 SD",
                actual: participant.fullName,
              })[value] ?? value
            }
          />
          <Line dataKey="sd3neg" stroke="#f43f5e" strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
          <Line dataKey="sd2neg" stroke="#f59e0b" strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
          <Line dataKey="median" stroke="#10b981" dot={false} strokeWidth={2.5} />
          <Line dataKey="sd2pos" stroke="#f59e0b" strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
          <Line dataKey="sd3pos" stroke="#f43f5e" strokeDasharray="4 4" dot={false} strokeWidth={1.5} />
          <Line
            data={actual}
            dataKey="weightKg"
            name="actual"
            stroke="#881337"
            strokeWidth={3}
            dot={{ r: 4, fill: "#881337" }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
