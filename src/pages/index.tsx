import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview?: boolean;
}

export default function Home({postsPagination, preview = false}: HomeProps) {

  const { results, next_page } = postsPagination;
  const [nextPage, setNextPage] = useState(next_page);
  const [resultsPost, setResultsPost] = useState<Post[]>(results);

  const handleNextPage = (): void => {
    fetch(nextPage).then(response => {
      response.json().then(responsePrismic => {
        setNextPage(responsePrismic.next_page);
        const posts = responsePrismic.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'dd MMM yyyy',
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            }
          };
        });
        setResultsPost([...resultsPost, ...posts]);
      });
    });
  }

  return (
    <div className={commonStyles.contentContainer}>
      {resultsPost.map(post => (
        <div key={post.uid}>
          <p className={styles.title}><Link href={`/post/${post.uid}`}>{post.data.title}</Link></p>
          <p className={styles.subtitle}>{post.data.subtitle}</p>
          <div className={styles.footer}>
            <span><AiOutlineCalendar />{post.first_publication_date}</span>
            <span><AiOutlineUser />{post.data.author}</span>
          </div>
        </div>
      ))}
      { next_page !== null && (
        <button className={styles.morePosts} type="button" onClick={handleNextPage}>
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.uid', 'posts.first_publication_date'],
    pageSize: 1
  });

  const posts = postsResponse.results.map((post: Post) => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts
      },
      preview
    }   
  }
};
