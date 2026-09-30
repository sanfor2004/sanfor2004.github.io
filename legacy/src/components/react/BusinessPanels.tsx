import type { ReactNode } from "react";

type Metric = {
  label: string;
  value: string;
  detail: string;
};

type Service = {
  title: string;
  description: string;
  href: string;
};

type Props = {
  metrics: Metric[];
  services: Service[];
};

function ArrowIcon(): ReactNode {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BusinessPanels({ metrics, services }: Props) {
  return (
    <div className="grid gap-6">
      <div className="stats stats-vertical overflow-hidden border border-base-300 bg-base-100 shadow-sm lg:stats-horizontal">
        {metrics.map((metric) => (
          <div className="stat" key={metric.label}>
            <div className="stat-title">{metric.label}</div>
            <div className="stat-value text-primary">{metric.value}</div>
            <div className="stat-desc">{metric.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <a
            className="business-card group rounded-box border border-base-300 bg-base-100 p-5 shadow-sm outline-none transition duration-150 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary"
            key={service.title}
            href={service.href}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="h-px flex-1 bg-primary/30" />
              <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-content transition duration-150 group-hover:scale-105">
                {ArrowIcon()}
              </span>
            </div>
            <h3 className="text-xl font-semibold">{service.title}</h3>
            <p className="mt-3 text-sm leading-6 text-base-content/70">{service.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
