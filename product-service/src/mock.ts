export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
}

export const PRODUCT_LIST: Product[] = [
  {
    id: 'P0001',
    title: 'Remarkably Bright Creatures',
    description: "A Read With Jenna Today Show Book Club Pick!",
    price: 14.99
  },
  {
    id: 'P0002',
    title: 'What My Bones Know: A Memoir of Healing from Complex Trauma',
    description: 'A searing memoir of reckoning and healing by acclaimed journalist Stephanie Foo, investigating the little-understood science behind complex PTSD and how it has shaped her life', 
    price: 13.99
  },
  {
    id: 'P0003',
    title: 'All My Rage',
    description: 'An INSTANT NEW YORK TIMES BESTSELLER! An INSTANT INDIE BESTSELLER!',
    price: 8.6
  },
  {
    id: 'P0004',
    title: 'The Maid',
    description: '#1 NEW YORK TIMES BESTSELLER • GOOD MORNING AMERICA BOOK CLUB PICK',
    price: 13.99
  }
]