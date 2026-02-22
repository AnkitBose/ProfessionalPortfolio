import { useMemo, useState } from "react";

type Props = {
  tags: string[];
};

export default function TagFilter({ tags }: Props) {
  const [selected, setSelected] = useState<string>("all");

  const options = useMemo(() => ["all", ...tags], [tags]);

  const applyFilter = (nextValue: string): void => {
    setSelected(nextValue);
    const items = document.querySelectorAll<HTMLElement>("[data-filter-item]");

    items.forEach((item) => {
      if (nextValue === "all") {
        item.classList.remove("hidden");
        return;
      }

      const tagValue = item.dataset.tags ?? "";
      const isVisible = tagValue.split(",").includes(nextValue.toLowerCase());
      item.classList.toggle("hidden", !isVisible);
    });
  };

  return (
    <fieldset className="card mb-6 p-4" aria-label="Filter entries by tag">
      <legend className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">Filter by tag</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => applyFilter(option)}
            className={`focus-ring rounded-full border px-3 py-1 text-xs font-medium transition ${
              selected === option
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:text-text"
            }`}
            aria-pressed={selected === option}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

