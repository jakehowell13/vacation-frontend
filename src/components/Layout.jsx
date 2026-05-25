import { Link } from "react-router-dom";

export const Layout = ({ children }) => {

    return (
        <div className="min-h-screen flex flex-col bg-primary/5">
            <header className="border-b border-primary/20 bg-primary/95 px-6 py-4 shadow-sm shadow-primary/5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-background">Vacation Planner</h1>
                    <nav className="flex gap-4">
                        <Link to="/" className="rounded-full px-3 py-1.5 text-background hover:bg-primary/10">Home</Link>
                        <Link to="/trips" className="rounded-full px-3 py-1.5 text-background hover:bg-primary/10">Trips</Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 p-6">
                {children}
            </main>
            <footer className="border-t border-primary/20 bg-primary/10 px-6 py-4 text-center text-sm text-muted-foreground">
                <p>&copy; 2024 Vacation Planner. All rights reserved.</p>
            </footer>
        </div>
    );
}
