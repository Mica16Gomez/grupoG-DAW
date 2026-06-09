import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstadosProyectosEnum } from "../enums/estados-proyectos.enum";
import { Cliente } from "./cliente.entity";
import { Tarea } from "./tarea.entity";

@Entity({ name: "proyectos" })
export class Proyecto {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({ type: 'enum', enum: EstadosProyectosEnum })
    estado!: EstadosProyectosEnum;

    @Column({ name: "id_cliente" })
    idCliente!: number;

    // --- NUEVO CAMPO: Fecha de finalización ---
    @Column({ name: "fecha_finalizacion", type: "date", nullable: true })
    fechaFinalizacion!: Date | null;

    @ManyToOne(()=>Cliente)
    @JoinColumn({name: "id_cliente"})
    cliente!: Cliente;

    @OneToMany(()=>Tarea, (tarea)=> tarea.proyecto)
    tareas!: Tarea[];

}
