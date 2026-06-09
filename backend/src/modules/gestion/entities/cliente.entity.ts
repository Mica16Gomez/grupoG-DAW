import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { Proyecto } from "./proyecto.entity";

@Entity({ name: "clientes" })
export class Cliente {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
telefono!: string | null;

  @Column({ type: "varchar", length: 150, nullable: true })
  email!: string | null;

  @Column({ type: "enum", enum: EstadosClientesEnum })
  estado!: EstadosClientesEnum;

  @OneToMany(() => Proyecto, (proyecto) => proyecto.cliente)
  proyectos!: Proyecto[];
}