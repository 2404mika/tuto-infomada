export interface Domaine {
    id: number;
    name: string;
    image?: File;
}
  
export interface NewDomaineData {
    name: string;
    image?: File;
}
export interface Formation {
  id: number;
  domaine: string;
  title: string;
  description: string;
  prix: string;
  prof: string;
  chapterName: string;
  chapterDecription: string;
  chapterVideo: string;

}

export interface NewFormationData {
  domaine: string;
  titre: string;
  description: string;
  prix: string;
  prof: string;
  chapterName: string;
  chapterDescription: string;
  chapterVideo: string;
}

export interface Prof{
  id: number;
  first_name: string;
  last_name:string;
  fonction: string;
  email: string;
  telephone: string;
  password: string;
}
export interface NewProf{
  first_name: string;
  last_name: string;
  fonction: string;
  email: string;
  telephone: string;
}

export interface Student{
  id: number;
  name: string;
  lastname:string;
  email:string;
  telephone: number;

}