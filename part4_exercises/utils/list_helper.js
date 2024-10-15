const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    console.log(likes)
    return likes.reduce((total, current) => total + current, 0)
}

const favoriteBlog = (blogs) => {
    let mostLikes = 0
    blogs.forEach((blog) => {
        if (blog.likes > mostLikes) {
            mostLikes = blog.likes
        }
    })

    return blogs.find(blog => blog.likes === mostLikes)
}

const mostBlogs = (blogs) => {
    const authors = []
    const counts = {}
    let highestCount = 0

    blogs.forEach((blog) => authors.push(blog.author))

    for (const author of authors) {
        counts[author] = counts[author] ? counts[author] + 1 : 1
    }

    Object.values(counts).forEach(count => {
        if (count > highestCount) {
            highestCount = count
        }
    })

    const author = Object.keys(counts).find(author => counts[author] === highestCount)

    return {
        "author": author,
        "blogs": highestCount
    }
}

const mostLikes = (blogs) => {
    const likeCounts = {}
    let highestCount = 0

    for (const blog of blogs) {
        likeCounts[blog.author] = likeCounts[blog.author] ? likeCounts[blog.author] + blog.likes : blog.likes
    }

    Object.values(likeCounts).forEach(count => {
        if (count > highestCount) {
            highestCount = count
        }
    })

    const author = Object.keys(likeCounts).find(author => likeCounts[author] === highestCount)

    return {
        "author": author,
        "likes": highestCount
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}