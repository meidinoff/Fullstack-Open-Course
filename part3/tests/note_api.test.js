import { test, after, beforeEach } from 'node:test'
import assert from 'assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import testHelper from './test_helper.js'
import Note from '../models/note.js'
import app from '../app.js'

const api = supertest(app)

beforeEach(async () => {
    await Note.deleteMany({})

    const noteObjects = testHelper.initialNotes.map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())

    await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
    console.log('entered test')
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, testHelper.initialNotes.length)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')

    assert.strictEqual(response.body.length, testHelper.initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
})

test.only('a valid note can be added ', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const notesAtEnd = await testHelper.notesInDb()
    assert.strictEqual(notesAtEnd.length, testHelper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    assert(contents.includes('async/await simplifies making async calls'))
})

test.only('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await testHelper.notesInDb()

    assert.strictEqual(notesAtEnd.length, testHelper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
    const notesAtStart = await testHelper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async () => {
    const notesAtStart = await testHelper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const notesAtEnd = await testHelper.notesInDb()

    const contents = notesAtEnd.map(r => r.content)
    assert(!contents.includes(noteToDelete.content))

    assert.strictEqual(notesAtEnd.length, testHelper.initialNotes.length - 1)
})

after(async () => {
    await mongoose.connection.close()
})