import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/db";
import { IMenu } from "@/types/menu";
import { DialogClose } from "@radix-ui/react-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { SelectTrigger } from "@radix-ui/react-select";
import { Ellipsis, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const AdminPage = () => {
    const [Menu, setMenu] = useState<IMenu[]>([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<{
        menu: IMenu;
        action: 'edit' | 'delete';
    } | null>(null);

  useEffect (() =>{
    const fetchMenu = async () => {
      const {data, error,} = await supabase.from('List_makanan').select('*');

      if(error) console.log('error: ', error);
      else setMenu(data);
    };

    fetchMenu();
  },[supabase]);
  
     const  handleAddMenu = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
    try {
            const {data, error} = await supabase
            .from('List_makanan')
            .insert(Object.fromEntries(formData))
            .select();

            if (error)console.log('error:', error);
            else{
                if (data){
                    setMenu((prev) => [...prev, ...data]);
                }
                toast('Menu berhasil ditambahkan');
                setCreateDialog(false);
            }
        }catch (error) {
            console.log('error', error);
        }
    };

    const handleUpdateMenu = async (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if(selectedMenu){
            const {data, error} = await supabase
            .from('List_makanan')
            .update(Object.fromEntries(formData))
            .eq('id', selectedMenu.menu.id)
            .select();

            if(error) console.log('error', error);
            else{
                if(data){
                    setMenu((prev)=> prev.map((item)=> item.id === selectedMenu.menu.id? {...item, ...data}: item)
                )
            };
        }
        toast('Menu Berhasil Di Edit');
        setSelectedMenu(null);
    }
}

    const handleDeleteMenu = async () =>{
        if(selectedMenu){
            try {
                const {data, error} = await supabase
                .from('List_makanan')
                .delete()
                .eq('id', selectedMenu?.menu.id)
    
                if (error)console.log('error:', error);
                else{
                    setMenu((prev) => prev.filter((Menu)=> Menu.id !== selectedMenu?.menu.id))
                    toast('Menu berhasil dihapus');
                    setSelectedMenu(null);
                }
            }catch (error) {
                console.log('error', error);
            }
        }
    }


    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">menu</div>
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                    <Button>Add menu</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleAddMenu} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>AddMenu</DialogTitle>
                                <DialogDescription>
                                    Create a new menu by insert data in form
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" placeholder="masukan nama" required/>
                                </div>

                            </div>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="price">price</Label>
                                    <Input id="price" name="price" placeholder="masukan harga" required/>
                                </div>
                            </div>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="image">Insert Image</Label>
                                    <Input id="images" name="image" placeholder="masukan gambar" required/>
                                </div>
                            </div>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="categori">Categori</Label>
                                    <Select name="categori" required>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="select categori"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>categori</SelectLabel>
                                                <SelectItem value="clasik">classic</SelectItem>
                                                <SelectItem value="modern">modern</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <div className="grid w-full gap-4">
                                <div className="grid w-full items-center gap-2">
                                    <Label htmlFor="description">Insert Description</Label>
                                    <Textarea id="description" name="description" placeholder="masukan description" required className="resize-none h-32"/>
                                </div>
                            </div>
                            <DialogFooter>
                            <DialogClose>
                            <Button variant="secondary" className="cursor-pointer">
                                Cancel
                            </Button>
                            </DialogClose>
                            <Button type ="submit" className="cursor-pointer">
                                Create
                            </Button>
                        </DialogFooter>
                            </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div>
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
                            <Image width={50} height={50} src={menu.imagePath} alt={menu.name}
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
                                    <DropdownMenuItem onClick={()=>setSelectedMenu({menu, action: "edit"})}
                                    >Edit</DropdownMenuItem>

                                    <DropdownMenuItem onClick={()=> setSelectedMenu({menu, action: 'delete'})} className="text-red-600">
                                        Delete</DropdownMenuItem>
                                </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                    
                    ))}
                </TableBody>
            </Table>
            </div>
            <Dialog open={selectedMenu !== null && selectedMenu.action === 'delete'}
            onOpenChange={(open) => {
                if (!open){
                    setSelectedMenu(null);
                }
            }}
                >
                    <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Delete Menu</DialogTitle>
                                <DialogDescription className="cursor-pointer">
                                    Apakah kamu yakin menghapus nya ? {selectedMenu?.menu.name}?
                                </DialogDescription>
                            </DialogHeader>
                           
                            
                            <div className="grid w-full gap-4">
                                <div className="grid w-full items-center gap-2">
                            <DialogFooter>
                            <DialogClose>
                            <Button variant="secondary" className="cursor-pointer">
                                Cancel
                            </Button>
                            </DialogClose>
                            <Button onClick={handleDeleteMenu} variant={'destructive'} className="cursor-pointer">
                                Delete
                            </Button>
                        </DialogFooter>
                            </div>
                            </div>
                    </DialogContent>
                </Dialog>
                <Dialog open={selectedMenu !== null && selectedMenu.action === 'edit'} onOpenChange={(open) => {
                if (!open) {
                    setSelectedMenu(null);
                }
            }}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleUpdateMenu} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>Update Menu</DialogTitle>
                            <DialogDescription>
                                Update the menu by editing the form
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid w-full gap-4">
                            <div className="grid w-full gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={selectedMenu?.menu.name} placeholder="masukan nama" required />
                            </div>
                        </div>
                        <div className="grid w-full gap-4">
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" name="price" defaultValue={selectedMenu?.menu.price} placeholder="masukan harga" required />
                            </div>
                        </div>
                        <div className="grid w-full gap-4">
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="image">Insert Image</Label>
                                <Input id="images" name="image" defaultValue={selectedMenu?.menu.imagePath} placeholder="masukan gambar" required />
                            </div>
                        </div>
                        <div className="grid w-full gap-4">
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="categori">Category</Label>
                                <Select name="categori" defaultValue={selectedMenu?.menu.categori} required>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>category</SelectLabel>
                                            <SelectItem value="classic">classic</SelectItem>
                                            <SelectItem value="modern">modern</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid w-full gap-4">
                            <div className="grid w-full items-center gap-2">
                                <Label htmlFor="description">Insert Description</Label>
                                <Textarea id="description" name="description" defaultValue={selectedMenu?.menu.description} placeholder="masukan description" required className="resize-none h-32" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant="secondary" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer">
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
};
export default AdminPage;