export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full pb-20 pt-4 border-t">
            <div className="container w-full mx-auto items-center flex justify-center">
                <p className="text-sm mx-auto text-center text-muted-foreground">
                    © {currentYear} Lapakin.com
                </p>
            </div>
        </footer>
    );
}