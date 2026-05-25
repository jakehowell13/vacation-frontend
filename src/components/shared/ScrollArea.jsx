export const ScrollArea = ({ children }) => {
  return (
    <div className="h-full w-full py-2 flex flex-1 flex-col gap-2 overflow-y-auto pr-4">
      {children}
    </div>
  );
}