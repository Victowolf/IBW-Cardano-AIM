const Footer = () => {
  return (
    <footer className="bg-black mt-auto">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between text-sm text-white">
        <div className="flex items-center gap-6">
          <a href="#" className="hover:opacity-80 transition-opacity">
            Contact
          </a>
          <a href="#" className="hover:opacity-80 transition-opacity">
            Terms of use
          </a>
        </div>
        <div>
          Powered by Cardano 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
