import { addDays, addMonths, formatDate, formatFullDate, isSameDay, parseISO } from './dateUtils'

export class CustomDateAdapter {
  constructor({ locale } = {}) {
    this.locale = locale
  }

  date(value) {
    if (value === null) return null
    if (value === undefined) return new Date()
    if (value instanceof Date) return new Date(value.getTime())
    if (typeof value === 'string') return parseISO(value)
    return new Date(value)
  }

  toJsDate(value) {
    return this.date(value)
  }

  parse(value, format) {
    if (value === '') return null
    return this.date(value)
  }

  format(date, format) {
    return formatDate(date)
  }

  formatByString(date, format) {
    return formatFullDate(date)
  }

  isValid(value) {
    const date = this.date(value)
    return date instanceof Date && !isNaN(date)
  }

  addDays(date, count) {
    return addDays(date, count)
  }

  addMonths(date, count) {
    return addMonths(date, count)
  }

  isEqual(date1, date2) {
    if (date1 === null && date2 === null) return true
    if (date1 === null || date2 === null) return false
    return isSameDay(this.date(date1), this.date(date2))
  }

  isSameDay(date1, date2) {
    return this.isEqual(date1, date2)
  }

  startOfDay(date) {
    const newDate = this.date(date)
    newDate.setHours(0, 0, 0, 0)
    return newDate
  }

  endOfDay(date) {
    const newDate = this.date(date)
    newDate.setHours(23, 59, 59, 999)
    return newDate
  }

  getYear(date) {
    return this.date(date).getFullYear()
  }

  getMonth(date) {
    return this.date(date).getMonth()
  }

  getDate(date) {
    return this.date(date).getDate()
  }

  setYear(date, year) {
    const newDate = this.date(date)
    newDate.setFullYear(year)
    return newDate
  }

  setMonth(date, month) {
    const newDate = this.date(date)
    newDate.setMonth(month)
    return newDate
  }

  setDate(date, day) {
    const newDate = this.date(date)
    newDate.setDate(day)
    return newDate
  }

  getNextMonth(date) {
    return this.addMonths(date, 1)
  }

  getPreviousMonth(date) {
    return this.addMonths(date, -1)
  }

  getWeekdays() {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  }

  getWeekArray(date) {
    const start = this.startOfWeek(this.startOfMonth(date))
    const end = this.endOfWeek(this.endOfMonth(date))

    const weeks = []
    let current = start
    while (current <= end) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(current))
        current = this.addDays(current, 1)
      }
      weeks.push(week)
    }
    return weeks
  }

  startOfMonth(date) {
    const newDate = this.date(date)
    newDate.setDate(1)
    newDate.setHours(0, 0, 0, 0)
    return newDate
  }

  endOfMonth(date) {
    const newDate = this.date(date)
    newDate.setMonth(newDate.getMonth() + 1, 0)
    newDate.setHours(23, 59, 59, 999)
    return newDate
  }

  startOfWeek(date) {
    const newDate = this.date(date)
    const day = newDate.getDay()
    return this.addDays(newDate, -day)
  }

  endOfWeek(date) {
    const newDate = this.date(date)
    const day = newDate.getDay()
    return this.addDays(newDate, 6 - day)
  }

  getDaysInMonth(date) {
    const newDate = this.date(date)
    return new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()
  }

  getMinutes(date) {
    return this.date(date).getMinutes()
  }

  getHours(date) {
    return this.date(date).getHours()
  }

  setMinutes(date, minutes) {
    const newDate = this.date(date)
    newDate.setMinutes(minutes)
    return newDate
  }

  setHours(date, hours) {
    const newDate = this.date(date)
    newDate.setHours(hours)
    return newDate
  }
}
