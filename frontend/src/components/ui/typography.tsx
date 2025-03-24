interface TypoProps {
  children: React.ReactNode;
  classname?: string;
}

export function TypoH1({ children }: TypoProps) {
  return (
    <h1 className="scroll-m-20 text-3xl md:text-5xl font-extrabold tracking-tight">
      {children}
    </h1>
  );
}

export function TypoH2({ classname, children }: TypoProps) {
  return (
    <h2
      className={`"scroll-m-20 pb-2 text-xl md:text-3xl font-semibold tracking-tight first:mt-0 " ${classname}`}
    >
      {children}
    </h2>
  );
}

export function TypoH3({ children }: TypoProps) {
  return (
    <h3 className="scroll-m-20 text-lg md:text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function TypoH4({ children }: TypoProps) {
  return (
    <h3 className="scroll-m-20 text-sm md:text-lg font-semibold tracking-tight">
      {children}
    </h3>
  );
}

export function TypoP({ children }: TypoProps) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

export function TypoBlockquote({ children }: TypoProps) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

export function TypoList({ children }: TypoProps) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
}

export function TypoTable() {
  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        <thead>
          <tr className="m-0 border-t p-0 even:bg-muted">
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              King's Treasury
            </th>
            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
              People's happiness
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="m-0 border-t p-0 even:bg-muted">
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Empty
            </td>
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Overflowing
            </td>
          </tr>
          <tr className="m-0 border-t p-0 even:bg-muted">
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Modest
            </td>
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Satisfied
            </td>
          </tr>
          <tr className="m-0 border-t p-0 even:bg-muted">
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Full
            </td>
            <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
              Ecstatic
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function TypoInlineCode({ children }: TypoProps) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}

export function TypoLead({ children }: TypoProps) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}

export function TypoLarge({ children }: TypoProps) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function TypoSmall({ children }: TypoProps) {
  return <small className="text-sm font-medium leading-none">{children}</small>;
}

export function TypoMuted({ children }: TypoProps) {
  return <p className="text-sm text-muted-foreground"> {children}</p>;
}
