import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartConfiguration, Plugin } from "chart.js";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
);

Chart.defaults.color = "#8b93a7";
Chart.defaults.font.family =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
Chart.defaults.font.size = 11;
Chart.defaults.borderColor = "#1f2633";
Chart.defaults.animation = false;

const registry = new Map<string, Chart>();

export function mount(id: string, cfg: ChartConfiguration): void {
  const canvas = document.getElementById(id);
  if (!(canvas instanceof HTMLCanvasElement)) return;
  registry.get(id)?.destroy();
  const chart = new Chart(canvas, cfg);
  registry.set(id, chart);
}

export function makeTodayLine(dayIndex: number, color = "#ffd166"): Plugin {
  return {
    id: "todayLine",
    afterDatasetsDraw(chart) {
      try {
        const x = chart.scales.x;
        if (!x) return;
        const px = x.getPixelForValue(dayIndex);
        const { top, bottom } = chart.chartArea;
        const ctx = chart.ctx;
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(px, top);
        ctx.lineTo(px, bottom);
        ctx.stroke();
        ctx.restore();
      } catch {
        /* chart disposed mid-draw */
      }
    },
  };
}
