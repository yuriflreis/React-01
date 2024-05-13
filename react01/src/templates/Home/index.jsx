import './styles.css';

import { Component } from 'react';

import { loadPosts } from '../../utils/load-posts';
import { Posts } from '../../components/Posts';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export class Home extends Component {
  state = {
    posts: [],
    allPosts: [],
    page: 0,
    postPerPage: 2,
    searchValue: ''
  }

  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    const { page, postPerPage } = this.state;
    const postsAndPhotos = await loadPosts();

    this.setState({ 
      posts: postsAndPhotos.slice(page, postPerPage), 
      allPosts: postsAndPhotos 
    });
  }

  loadMorePosts = () => {
    const {
      page,
      postPerPage,
      allPosts,
      posts
    } = this.state;

    const nextPage = page + postPerPage;
    const nextPosts = allPosts.slice(nextPage, nextPage + postPerPage);
    posts.push(...nextPosts);

    this.setState({ posts, page: nextPage });
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  }

  render() {
    const { posts, page, postsPerPage, allPosts, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allPosts.length;
    const filterPosts = !!searchValue ? 
      allPosts.filter(post => {
        return post.title.toLowerCase().includes(searchValue.toLowerCase());
      }) : posts;

    return (
      <section className="container">
        <div className="search-container">
          {!!searchValue && (
            <h1>Search Value: {searchValue}</h1>
          )}
          <TextInput 
            searchValue = {searchValue}
            handleChange = {this.handleChange}
          />
        </div>        

        {filterPosts.length > 0 && (
          <Posts posts = {filterPosts} />
        )}   

        {filterPosts.length === 0 && (
          <p>Não existem posts</p>
        )}      

        <div className="button-container">
          {!searchValue && (
            <Button 
              text = {"texto qualquer"} 
              onClick = {this.loadMorePosts}
              disabled = {noMorePosts}
            />
          )}          
        </div>        
      </section>      
    );
  }
}