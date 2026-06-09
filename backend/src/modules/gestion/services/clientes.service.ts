import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { CreateClienteDto } from "../dtos/input/create-cliente.dto";
import { UpdateClienteDto } from "../dtos/input/update-cliente.dto";
import { ListClienteDTO } from "../dtos/output/list-cliente.dto";
import { Cliente } from "../entities/cliente.entity";
import { EstadosClientesEnum } from "../enums/estados-clientes.enum";
import { ProyectosService } from "./proyectos.service";

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repository: Repository<Cliente>,
    @Inject(forwardRef(() => ProyectosService))
    private readonly proyectosService: ProyectosService
  ) {}

  private readonly dominiosPermitidos: string[] = [
    "gmail.com",
    "hotmail.com",
    "outlook.com",
    "live.com",
    "yahoo.com",
    "yahoo.com.ar",
    "icloud.com",
  ];

  private normalizarTexto(valor: string): string {
    return valor.trim();
  }

  private normalizarEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private validarDominioEmail(email: string): void {
    const partes = email.split("@");

    if (partes.length !== 2) {
      return;
    }

    const dominio = partes[1].toLowerCase();

    if (!this.dominiosPermitidos.includes(dominio)) {
      throw new BadRequestException(
        "El dominio del correo no es válido. Use uno de los dominios permitidos: gmail.com, hotmail.com, outlook.com, live.com, yahoo.com, yahoo.com.ar o icloud.com"
      );
    }
  }

  async crearCliente(dto: CreateClienteDto): Promise<{ id: number }> {
    const emailNormalizado = this.normalizarEmail(dto.email);
    this.validarDominioEmail(emailNormalizado);

    const cliente: Cliente = this.repository.create({
      nombre: this.normalizarTexto(dto.nombre),
      telefono: this.normalizarTexto(dto.telefono),
      email: emailNormalizado,
      estado: EstadosClientesEnum.ACTIVO,
    });

    await this.repository.save(cliente);

    return { id: cliente.id };
  }

  async actualizarCliente(id: number, dto: UpdateClienteDto): Promise<void> {
    const cliente: Cliente | null = await this.repository.findOneBy({ id });

    if (!cliente) {
      throw new BadRequestException("Cliente no encontrado");
    }

    const relacionadoConProyectos: boolean =
      await this.proyectosService.existeProyectoPorIdCliente(id);

    if (relacionadoConProyectos && dto.estado === EstadosClientesEnum.BAJA) {
      throw new BadRequestException(
        "No se puede dar de baja un cliente con proyectos relacionados"
      );
    }

    const nombreNormalizado: string =
      dto.nombre !== undefined
        ? this.normalizarTexto(dto.nombre)
        : cliente.nombre;

    const telefonoNormalizado: string | null =
      dto.telefono !== undefined
        ? this.normalizarTexto(dto.telefono)
        : cliente.telefono;

    let emailNormalizado: string | null = cliente.email;

    if (dto.email !== undefined) {
      emailNormalizado = this.normalizarEmail(dto.email);
      this.validarDominioEmail(emailNormalizado);
    }

    this.repository.merge(cliente, {
      ...dto,
      nombre: nombreNormalizado,
      telefono: telefonoNormalizado,
      email: emailNormalizado,
    });

    await this.repository.save(cliente);
  }

  async obtenerClientes(estado?: EstadosClientesEnum): Promise<ListClienteDTO[]> {
    const whereCondition: FindOptionsWhere<Cliente> = {};

    if (estado) {
      whereCondition.estado = estado;
    }

    const clientes: Cliente[] = await this.repository.find({
      select: {
        id: true,
        nombre: true,
        telefono: true,
        email: true,
        estado: true,
      },
      order: { id: "ASC" },
      where: whereCondition,
    });

    const dtoList: ListClienteDTO[] = [];

    for (const c of clientes) {
      const dto = new ListClienteDTO();
      dto.id = c.id;
      dto.nombre = c.nombre;
      dto.telefono = c.telefono;
      dto.email = c.email;
      dto.estado = c.estado;
      dtoList.push(dto);
    }

    return dtoList;
  }

  async existeClienteActivoPorId(id: number): Promise<boolean> {
    const existe: boolean = await this.repository.exists({
      where: { id, estado: EstadosClientesEnum.ACTIVO },
    });

    return existe;
  }
}