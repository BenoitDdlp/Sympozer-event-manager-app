<?php

namespace fibe\ContentBundle\Repository;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\QueryBuilder;

/**
 * RoleLabelRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class RoleLabelRepository extends EntityRepository
{

    /**
     * filtering with all parameters difned
     * @param QueryBuilder $qb , query builder to add the filter to
     * @param array $params , the field to filter on
     * @return QueryBuilder $qb, modified query builder
     */
    public function filter(QueryBuilder $qb, array $params)
    {
        if (isset($params['mainEventId'])) {
            $qb->leftJoin('qb.roles', 'roles')
                ->andWhere('roles.mainEvent = (:mainEventId)')
                ->setParameter('mainEventId', $params['mainEventId']);
            return $qb;
        }
    }

}
