import { useEffect, useState } from 'react';
import { fetchHistoricalAnalytics, type HistoricalAnalyticsResponse } from '@/lib/api';

type HeatmapResponse = Pick<HistoricalAnalyticsResponse, 'heatmapData' | 'insights'>;

function getWidth(value: number) {
  return `${Math.min((value / 70) * 100, 100)}%`;
}

function getPeriodTone(value: number) {
  if (value >= 45) return 'from-red-500 via-orange-500 to-amber-400';
  if (value >= 25) return 'from-amber-500 via-yellow-500 to-lime-400';
  return 'from-emerald-500 via-teal-500 to-cyan-400';
}

let cachedHeatmap: HeatmapResponse | null = null;

export default function WaitingTimeHeatmap() {
  const [data, setData] = useState<HeatmapResponse | null>(cachedHeatmap);
  const [loading, setLoading] = useState(!cachedHeatmap);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHeatmap() {
      if (cachedHeatmap) {
        setData(cachedHeatmap);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetchHistoricalAnalytics();
        const nextData = {
          heatmapData: response.heatmapData ?? [],
          insights: response.insights,
        };

        cachedHeatmap = nextData;

        if (!cancelled) {
          setData(nextData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load waiting time heatmap.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHeatmap();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900">Waiting Time Heatmap</h3>
      <p className="mt-1 text-sm text-gray-600">Historical waits by day and period from the analytics service.</p>

      {loading ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-600">
          Loading heatmap...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {data?.heatmapData?.map((row) => (
              <div key={row.day} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="mb-3 font-semibold text-gray-900">{row.day}</p>
                <div className="space-y-3">
                  {[
                    { label: 'Morning', value: row.morning },
                    { label: 'Afternoon', value: row.afternoon },
                    { label: 'Evening', value: row.evening },
                  ].map((period) => (
                    <div key={period.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{period.label}</span>
                        <span className="font-semibold text-gray-900">{period.value}m</span>
                      </div>
                      <div className="h-10 overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <div
                          className={`h-full rounded-lg bg-gradient-to-r ${getPeriodTone(period.value)}`}
                          style={{ width: getWidth(period.value) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {data?.insights?.length ? (
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {data.insights.map((insight) => (
                <div key={insight.title} className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4">
                  <p className="font-semibold text-gray-900">{insight.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{insight.desc}</p>
                  <p className="mt-3 text-sm font-semibold text-blue-700">{insight.value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
