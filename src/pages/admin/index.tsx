import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/db";
import { IMenu } from "@/types/menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AdminPage = () => {
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
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">menu</div>
            <Button>Add menu</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>product</TableHead>
                        <TableHead>description</TableHead>
                        <TableHead>categori</TableHead>
                        <TableHead>price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Menu.map((menu: IMenu) =>(
                    <TableRow key={menu.id}>
                        <TableCell className="flex gap-3 items-center w-full">
                            <Image width={50} height={50} src={menu.image} alt={menu.name}
                            className="aspect-square object-cover rounded-lg"
                            />
                            {menu.name}
                        </TableCell>
                        <TableCell>{menu.description.toLowerCase().slice()}
                        </TableCell>
                        <TableCell>{menu.categori}</TableCell>
                        <TableCell>Rp.{menu.price},00</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="cursor-pointer"
                                >
                                    <Ellipsis />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel className="font-bold">
                                    Action
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>Update</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    
                    ))}
                </TableBody>
            </Table>
        </div>

    )
}
export default AdminPage;