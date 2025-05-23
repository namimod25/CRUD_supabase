import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/db";
import { IMenu } from "@/types/menu";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const DetailMenu = () => {
    const router = useRouter();
    const [Menu, setMenu] = useState<IMenu | null>(null);

    useEffect(() => {
        if(router.query.id) {
            const fetchMenu = async () => {
                const {data, error,} = await supabase.from('List_makanan').select('*').eq('id', router.query.id);
            }
        }
    })
        
    return(
        <div className="container mx-auto py-8">
            <div className="flex gap-16">
                {Menu &&(
                    <div className="flex gap-16 items-center">
                        <div className="w-1/2">
                        <Image src={Menu.image} alt={Menu.name} width={360} height={1080} className="w-full h-[70vh] object-cover rounded-2xl"
                        />
                        </div>
                        <div className="w-1/2">
                        <h1 className="text-5xl font-bold mb-4">{Menu.name}</h1>
                            <p className="text-xl mb-4 text-neutral-500">
                            {Menu.description}</p>
                        <div className="flex gap-4 items-center">
                            <p className="text-4xl font-bold">Rp.{Menu.price},00</p>
                            <Button className="text-lg py-6 font-bold" size={'lg'}>Pesan Sekarang</Button>
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default DetailMenu;