import { TypoSmall } from "./ui/typography";

const Footer = () => {
  return (
    <footer className="flex justify-center gap-4 items-center h-10 mt-5 w-full">
      <TypoSmall>&copy; 2025 Chef!</TypoSmall>
      {" | "}
      <a href="mailto:benjamin.vandamme@me.com" className="ml-4 underline">
        <TypoSmall>Contact</TypoSmall>
      </a>
      {" | "}
      <a href="mailto:benjamin.vandamme@me.com" className="ml-4 underline">
        <TypoSmall>Report a Bug</TypoSmall>
      </a>
    </footer>
  );
};

export default Footer;
