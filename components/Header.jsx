import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between max-w-4xl mx-auto px-4">
      <div className="flex items-center text-3xl space-x-5">
        <Link href="/">HOME</Link>

        <div className="hidden md:inline-flex items-center space-x-5 text-lg">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3>Follow</h3>
        </div>
      </div>
      <div className="flex items-center text-green-600 gap-4">
        <h3>Contact</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600">
          Follow
        </h3>
      </div>
    </header>
  );
};

export default Header;
