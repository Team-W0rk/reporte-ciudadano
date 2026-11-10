import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import type {
  Dispositivo,
  PruebaDePush,
  RespuestaUno,
} from '../../../contract/api.js';
import { UsuarioActual } from '../../common/auth/decorators.js';
import { respuestaUno } from '../../common/response/response.js';
import {
  DocConSesion,
  DocErrores,
  DocRespuestaUno,
} from '../../common/swagger/documentation.js';
import {
  DispositivoDoc,
  PruebaDePushDoc,
} from '../../common/swagger/models.js';
import type { Usuario } from '../users/user.entity.js';
import { aDispositivo } from './devices.mapper.js';
import { ServicioDispositivos } from './devices.service.js';
import { RegistrarDispositivoDto } from './dto/register-device.dto.js';
import { EmptyBodyDto } from './dto/empty-body.dto.js';

@ApiTags('Notificaciones')
@Controller('dispositivos')
@DocConSesion()
export class ControladorDispositivos {
  constructor(private readonly dispositivos: ServicioDispositivos) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar el token de push de este teléfono',
    description:
      'Registra el token de Expo del teléfono para la cuenta autenticada. Se puede repetir: si ya estaba registrado para esa cuenta responde 200. Si pertenecía a otra cuenta, pasa a la cuenta actual.',
  })
  @DocRespuestaUno(201, DispositivoDoc, 'Registrado.')
  @DocRespuestaUno(200, DispositivoDoc, 'Ya estaba registrado.')
  @DocErrores('VALIDACION_FALLIDA')
  async registrar(
    @UsuarioActual() usuario: Usuario,
    @Body() dto: RegistrarDispositivoDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RespuestaUno<Dispositivo>> {
    const { creado } = await this.dispositivos.registrar(usuario, dto);
    res.status(creado ? 201 : 200);
    return respuestaUno(aDispositivo(dto));
  }

  @Post('prueba')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Mandarme una push de prueba',
    description:
      'Envía una notificación de prueba a los teléfonos registrados de la cuenta autenticada. Devuelve la cantidad de notificaciones enviadas.',
  })
  @DocRespuestaUno(
    200,
    PruebaDePushDoc,
    'Cantidad de notificaciones enviadas (0 si no hay dispositivos registrados o los avisos están apagados).',
  )
  async probar(
    @UsuarioActual() usuario: Usuario,
    @Body() _dto: EmptyBodyDto,
  ): Promise<RespuestaUno<PruebaDePush>> {
    return respuestaUno({ enviadas: await this.dispositivos.probar(usuario) });
  }

  @Delete(':tokenExpo')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Dar de baja el token de este teléfono',
    description:
      'Da de baja el token del teléfono para la cuenta autenticada. Si el token no estaba registrado para esa cuenta, no realiza cambios.',
  })
  @ApiNoContentResponse({ description: 'Dado de baja (sin cuerpo).' })
  async darDeBaja(
    @UsuarioActual() usuario: Usuario,
    @Param('tokenExpo') tokenExpo: string,
  ): Promise<void> {
    await this.dispositivos.darDeBaja(usuario, tokenExpo);
  }
}
