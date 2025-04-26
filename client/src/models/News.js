class News {
    constructor(id, title, content, author, createdAt, imageUrl) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = createdAt;
        this.imageUrl = imageUrl;
    }

    static fromFirestore(data) {
        return new News(
            data.id,
            data.title,
            data.content,
            data.author,
            data.createdAt,
            data.imageUrl
        );
    }

    toFirestore() {
        return {
            title: this.title,
            content: this.content,
            author: this.author,
            createdAt: this.createdAt,
            imageUrl: this.imageUrl
        };
    }
}

export default News; 