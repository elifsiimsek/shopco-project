type Props = {
  title: string;
  align?: "center" | "left";
};

const Title = ({ title }: Props) => {
  return (
    <h2 className={`text-[32px] md:text-[48px] font-[1000] text-center mb-8 md:mb-14 uppercase tracking-tighter`}>
      {title}
    </h2>
  );
};

export default Title;
