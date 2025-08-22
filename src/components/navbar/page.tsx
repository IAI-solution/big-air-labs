import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="w-full py-4 px-6 bg-gray-900 text-white shadow-md flex justify-between items-center">
            <div className="text-lg font-bold">
                Big Air Labs
            </div>
            <ul className="flex gap-6 text-sm sm:text-base">
                <li>
                    <Link href="/" className="hover:text-gray-400">Home</Link>
                </li>
                <li>
                    <Link href="/about" className="hover:text-gray-400">About</Link>
                </li>
                <li>
                    <Link href="/contact" className="hover:text-gray-400">Contact</Link>
                </li>
            </ul>
        </nav>
    );
}
