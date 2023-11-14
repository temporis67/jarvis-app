import { GlobeAltIcon, ChatBubbleLeftRightIcon  } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/lib/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <ChatBubbleLeftRightIcon className="h-12 w-12 rotate-[345deg]" />
      <p className="text-[44px] p-2"> Jarvis</p>
    </div>
  );
}
