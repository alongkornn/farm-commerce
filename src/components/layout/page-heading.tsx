export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container-page flex flex-col gap-5 py-7 sm:flex-row sm:items-end sm:justify-between sm:py-10">
        <div>
          {eyebrow ? (
            <p className="text-sm font-bold text-primary">{eyebrow}</p>
          ) : null}
          <h1 className="mt-1 text-2xl font-extrabold leading-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center">{actions}</div> : null}
      </div>
    </section>
  );
}
