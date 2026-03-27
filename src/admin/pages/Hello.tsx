export default function Hello() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Добро пожаловать 👋</h1>
        <p className="text-foreground/50">Выберите раздел в меню слева для управления контентом.</p>
      </div>
    </div>
  );
}
