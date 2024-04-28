export class Scheduler {
  constructor(max) {
    this.max = max
    this.count = 0
    this.queue = []
  }
  async add(fn) {
    if (this.count >= this.max) {
      await new Promise((resolve) => this.queue.push(resolve))
    }
    this.count++
    const res = await fn()
    this.count--
    this.queue.length && this.queue.shift()()
    return res
  }
}
