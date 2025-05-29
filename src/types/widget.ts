
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  dataSource?: string;
  isPinned?: boolean;
  settings?: Record<string, any>;
}

export type WidgetType = 
  | 'InfoCardSmall'
  | 'InfoCardMedium' 
  | 'InfoCardLarge'
  | 'KpiCard'
  | 'LineChart'
  | 'BarChart'
  | 'StackedBarChart'
  | 'PieChart'
  | 'DonutChart'
  | 'DataTable'
  | 'ActivityTimeline'
  | 'SortableList'
  | 'FilterableList'
  | 'Heatmap'
  | 'Gauge'
  | 'Dial'
  | 'GeoMap'
  | 'TreeMap'
  | 'BulletChart'
  | 'WordCloud'
  | 'AccordionPanel'
  | 'RadialProgress';

export interface DataSource {
  id: string;
  name: string;
  data: any[];
  schema: Record<string, string>;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: Date;
  updatedAt: Date;
}
