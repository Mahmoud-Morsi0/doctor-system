import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reservation-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ButtonModule, TranslocoModule, TableModule],
  templateUrl: './reservation.page.html',
})
export class ReservationPage {
  reservations = [
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
    {
      reservationId: 'RES-2026-00045',
      patient: {
        id: 'PAT-556',
        name: 'Mohamed Alkayal',
        phone: '+201012345678',
      },
      appointment: {
        date: '2026-01-05',
        startTime: '14:30',
        endTime: '15:00',
        durationMinutes: 30,
      },
      status: 'CONFIRMED',
      payment: {
        method: 'CASH',
        amount: 500,
        currency: 'EGP',
        paid: false,
      },
      clinic: {
        id: 'CL-01',
        name: 'Downtown Medical Center',
        room: 'Room 3',
      },
      createdAt: '2026-01-03T10:15:00Z',
      notes: 'Patient complains of chest pain',
    },
  ];
}
