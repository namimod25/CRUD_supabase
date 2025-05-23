import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/db';
import type { IMenu } from '@/types/menu';
import Image from 'next/image';
import {useEffect, useState} from 'react'

const Home = () => {                                        //FETCH Data supabase
  const [Menu, setMenu] = useState<IMenu[]>([]);

  useEffect (() =>{
    const fetchMenu = async () => {
      const {data, error,} = await supabase.from('List_makanan').select('*');

      if(error) console.log('error: ', error);
      else setMenu(data);
    };

    fetchMenu();
  },[supabase]);

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-4'></h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        {Menu.map((menu: IMenu)=>(
          <Card key={menu.id}>
            <CardContent>
              <Image src={menu.image} alt={menu.name} width={200} height={200} className='w-full h-[30vh] object-cover rounded-lg'/>

              <div className='mt-4 flex justify-between'>
                <div>
                  <h4 className='font-semibold text-xl'>{menu.name}</h4>
                  <p>{menu.categori}</p>
                </div>
                <p className='font-semibold text-2xl'>Rp.{menu.price},00</p>
              </div>
            </CardContent>
            <Button className='w-full font-bold' size={'lg'}>Detail</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Home;
