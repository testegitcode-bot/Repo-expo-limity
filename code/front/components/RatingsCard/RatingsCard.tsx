import { FaStar } from "react-icons/fa6";

interface props {
  rating: number;
  title: string;
  name: string;
}

export default function RatingsCard({ rating, title, name }: props) {
  return (
    <div className="flex flex-col gap-2 bg-white pt-5 pb-3 rounded-2xl max-w-5xl mx-auto text-center">
      <span className="text-amarelo w-full flex justify-center gap-2">
        {Array.from({ length: rating }, (_, index) => (
          <FaStar key={index} />
        ))}
      </span>
      <p className="text-lg text-azul font-bold">&quot;{title}&quot;</p>
      <p className="text-xs">{name}</p>
    </div>
  );
}
